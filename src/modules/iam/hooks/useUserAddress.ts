"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { addressApi } from "../api/address.api";
import { Province, City, District, UserAddress, AddressFormState } from "../types/address.types";

const DEFAULT_FORM_STATE: AddressFormState = {
  address: "",
  state: "",
  city: "",
  district: "",
  postal_code: "",
  country: "Indonesia",
};

export function useUserAddress() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [formState, setFormState] = useState<AddressFormState>(DEFAULT_FORM_STATE);
  const [savedAddress, setSavedAddress] = useState<UserAddress | null>(null);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Districts based on City ID
  const fetchDistricts = useCallback(async (cityId: string) => {
    if (!cityId) {
      setDistricts([]);
      return;
    }
    try {
      setIsLoadingDistricts(true);
      const data = await addressApi.getDistricts(cityId);
      setDistricts(data);
    } catch {
      toast.error("Gagal memuat data kecamatan.");
    } finally {
      setIsLoadingDistricts(false);
    }
  }, []);

  // Handle Province Selection
  const handleProvinceChange = useCallback(
    async (provinceName: string, autoCity?: string, autoDistrict?: string) => {
      setFormState((prev) => ({
        ...prev,
        state: provinceName,
        city: autoCity || "",
        district: autoDistrict || "",
      }));
      setCities([]);
      setDistricts([]);

      if (!provinceName) return;

      const selected = provinces.find((p) => p.name.toUpperCase() === provinceName.toUpperCase());
      if (selected) {
        setIsLoadingCities(true);
        try {
          const citiesData = await addressApi.getCities(selected.id);
          setCities(citiesData);

          if (autoCity) {
            const cityMatch = citiesData.find(
              (c) => c.name.toUpperCase() === autoCity.toUpperCase()
            );
            if (cityMatch) {
              setIsLoadingDistricts(true);
              const districtData = await addressApi.getDistricts(cityMatch.id);
              setDistricts(districtData);
            }
          }
        } catch {
          toast.error("Gagal memuat data wilayah turunan.");
        } finally {
          setIsLoadingCities(false);
          setIsLoadingDistricts(false);
        }
      }
    },
    [provinces]
  );

  // Handle City Selection
  const handleCityChange = useCallback(
    async (cityName: string, autoDistrict?: string) => {
      setFormState((prev) => ({
        ...prev,
        city: cityName,
        district: autoDistrict || "",
      }));
      setDistricts([]);

      if (!cityName) return;

      const selected = cities.find((c) => c.name.toUpperCase() === cityName.toUpperCase());
      if (selected) {
        await fetchDistricts(selected.id);
      }
    },
    [cities, fetchDistricts]
  );

  // Handle District Selection
  const handleDistrictChange = useCallback((districtName: string) => {
    setFormState((prev) => ({
      ...prev,
      district: districtName,
    }));
  }, []);

  // Handle Generic Field Change
  const handleFieldChange = useCallback((field: keyof AddressFormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Initial Data Fetching (Provinces + User Address from Backend)
  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      try {
        setIsLoadingInitial(true);
        const [provs, existingAddr] = await Promise.all([
          addressApi.getProvinces(),
          addressApi.getUserAddress(),
        ]);

        if (!isMounted) return;
        setProvinces(provs);

        if (existingAddr) {
          setSavedAddress(existingAddr);
          setFormState({
            address: existingAddr.address || "",
            state: existingAddr.state || "",
            city: existingAddr.city || "",
            district: "",
            postal_code: existingAddr.postalCode || "",
            country: "Indonesia",
          });

          // Cascade fetch cities if state exists
          if (existingAddr.state) {
            const selectedProv = provs.find(
              (p) => p.name.toUpperCase() === existingAddr.state.toUpperCase()
            );
            if (selectedProv) {
              const citiesData = await addressApi.getCities(selectedProv.id);
              if (isMounted) {
                setCities(citiesData);
                if (existingAddr.city) {
                  const selectedCity = citiesData.find(
                    (c) => c.name.toUpperCase() === existingAddr.city.toUpperCase()
                  );
                  if (selectedCity) {
                    const distData = await addressApi.getDistricts(selectedCity.id);
                    if (isMounted) setDistricts(distData);
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load initial address data:", err);
      } finally {
        if (isMounted) setIsLoadingInitial(false);
      }
    }

    loadInitial();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save / Update Address
  const handleSubmit = async (e?: React.FormEvent): Promise<boolean> => {
    if (e) e.preventDefault();

    if (!formState.address.trim()) {
      toast.error("Alamat jalan lengkap wajib diisi.");
      return false;
    }
    if (!formState.state) {
      toast.error("Provinsi wajib dipilih.");
      return false;
    }
    if (!formState.city) {
      toast.error("Kota / Kabupaten wajib dipilih.");
      return false;
    }
    if (!formState.postal_code.trim()) {
      toast.error("Kode Pos wajib diisi.");
      return false;
    }

    try {
      setIsSaving(true);
      const res = await addressApi.upsertUserAddress({
        address: formState.address.trim(),
        state: formState.state,
        city: formState.city,
        postal_code: formState.postal_code.trim(),
      });

      toast.success(res.message || "Alamat berhasil disimpan!", { id: "user-address-save" });
      setSavedAddress((prev) => ({
        id: prev?.id || "saved",
        userId: prev?.userId || "",
        name: prev?.name || "",
        address: formState.address.trim(),
        state: formState.state,
        city: formState.city,
        postalCode: formState.postal_code.trim(),
        updatedAt: new Date().toISOString(),
      }));
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan data alamat.";
      toast.error(msg, { id: "user-address-save" });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    provinces,
    cities,
    districts,
    formState,
    savedAddress,
    isLoadingInitial,
    isLoadingCities,
    isLoadingDistricts,
    isSaving,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleFieldChange,
    handleSubmit,
  };
}
