import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | JobHighway",
  description:
    "Have a question, feedback or want to partner with JobHighway? Get in touch with our team directly.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
