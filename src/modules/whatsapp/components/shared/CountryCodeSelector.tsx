"use client";

import React from "react";
import {
  CountryCodeSelector as SharedCountryCodeSelector,
  CountryCodeSelectorProps as SharedProps,
} from "@/components/shared/CountryCodeSelector";

export type CountryCodeSelectorProps = SharedProps;

export function CountryCodeSelector(props: CountryCodeSelectorProps) {
  return <SharedCountryCodeSelector variant="rounded" {...props} />;
}
