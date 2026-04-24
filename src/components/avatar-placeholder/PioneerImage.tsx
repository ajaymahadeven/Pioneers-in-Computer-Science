"use client";

import { useState } from "react";
import Image from "next/image";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";

interface Props {
  src: string;
  alt: string;
  name: string;
  sizes: string;
  className?: string;
}

export function PioneerImage({ src, alt, name, sizes, className }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) return <AvatarPlaceholder name={name} />;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
