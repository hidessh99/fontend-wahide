"use client";

import React, { useState } from "react";
import { UserItem, UpdateUserInput } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { generateSecureRandomString } from "@/lib/utils";
import {
  Edit,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  Save,
  Shield,
  Phone,
  Mail,
  User,
  Lock,
} from "lucide-react";

interface EditUserModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string, data: UpdateUserInput) => Promise<unknown>;
}

interface EditUserModalContentProps {
  user: UserItem;
  onClose: () => void;
  onSubmit: (userId: string, data: UpdateUserInput) => Promise<unknown>;
}

function EditUserModalContent({ user, onClose, onSubmit }: EditUserModalContentProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || user.phone || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(user.status === "ACTIVE" || user.isActive === true);
  const [role, setRole] = useState(user.role || user.roleName || "SELLER");
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePassword = () => {
    const randomPass = generateSecureRandomString("Wahide@", 6);
    setPassword(randomPass);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload: UpdateUserInput = {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        isActive: isActive,
        role: role,
      };
      if (password.trim()) {
        payload.password = password.trim();
      }

      await onSubmit(user.id, payload);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <DialogHeader className="border-border flex flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
        <div className="dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          <Edit className="size-5" />
        </div>
        <div>
          <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
            Ubah Data Pengguna
          </DialogTitle>
          <DialogDescription className="text-foreground-secondary text-xs font-semibold">
            Kelola profil, kontak, peran, dan reset kata sandi akun {user.name}.
          </DialogDescription>
        </div>
      </DialogHeader>

      {/* Scrollable Form Body */}
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex-1 space-y-4 p-5 text-xs sm:p-6">
          {/* Nama Lengkap */}
          <div>
            <label
              htmlFor="edit-user-name"
              className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
            >
              <User className="size-3.5" />
              <span>Nama Lengkap:</span>
            </label>
            <Input
              id="edit-user-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: John Doe"
              variant="pill"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="edit-user-email"
              className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
            >
              <Mail className="size-3.5" />
              <span>Alamat Email:</span>
            </label>
            <Input
              id="edit-user-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              variant="pill"
            />
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label
              htmlFor="edit-user-phone"
              className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
            >
              <Phone className="size-3.5" />
              <span>Nomor WhatsApp:</span>
            </label>
            <Input
              id="edit-user-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="6281234567890"
              variant="pill"
              className="font-mono"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor="edit-user-role"
              className="text-foreground-secondary mb-1 flex items-center gap-1.5 font-bold"
            >
              <Shield className="size-3.5" />
              <span>Peran Akun (Role):</span>
            </label>
            <NativeSelect
              id="edit-user-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              variant="pill"
            >
              <option value="SELLER">SELLER (Pengguna Standar)</option>
              <option value="ADMIN">ADMIN (Staf Pengelola Platform)</option>
              <option value="SUPERADMIN">SUPERADMIN (Akses Penuh)</option>
            </NativeSelect>
          </div>

          {/* Status Toggle */}
          <div className="border-border bg-muted/20 flex items-center justify-between rounded-lg border p-3">
            <div>
              <span className="text-foreground block font-bold">Status Akun Aktif</span>
              <span className="text-foreground-secondary text-[11px]">
                Izinkan pengguna login dan mengakses seluruh modul Wahide.
              </span>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label="Status Akun Aktif"
            />
          </div>

          {/* Reset Password Optional */}
          <div className="border-border space-y-2 border-t pt-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-user-password"
                className="text-foreground-secondary flex items-center gap-1.5 font-bold"
              >
                <Lock className="size-3.5" />
                <span>Reset Kata Sandi (Opsional):</span>
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="dark:text-wise-green flex cursor-pointer items-center gap-1 font-mono text-[11px] font-bold text-emerald-600 hover:underline"
              >
                <Sparkles className="size-3" />
                <span>Acak Sandi Kuat</span>
              </button>
            </div>
            <div className="relative">
              <Input
                id="edit-user-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin mengubah sandi"
                variant="pill"
                className="pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {password && (
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                ⚠️ Kata sandi pengguna akan langsung ditimpa menjadi:{" "}
                <code className="bg-muted rounded px-1 font-mono font-bold">{password}</code>
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-3 rounded-none border-t p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="border-border hover:bg-muted rounded-full text-xs font-bold"
          >
            Batalkan
          </Button>

          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isLoading || !name.trim() || !email.trim()}
            className="gap-1.5 rounded-full px-5 text-xs font-extrabold shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function EditUserModal({ user, isOpen, onClose, onSubmit }: EditUserModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface max-h-[92vh] max-w-lg gap-0 overflow-hidden p-0 dark:bg-[#161715]">
        <EditUserModalContent key={user.id} user={user} onClose={onClose} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
