import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & ATS Partnership Inquiries",
  description: "Get in touch with the JobHighway team for questions, partnerships, reporting broken ATS job links, or employer integrations.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
