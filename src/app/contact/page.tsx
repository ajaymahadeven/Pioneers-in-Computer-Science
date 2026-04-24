import type { Metadata } from "next";
import { ContactForm } from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch to dispute information, suggest a pioneer, or ask a question.",
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="border-border border-b">
        <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
          <p className="text-muted-foreground mb-2 text-[10px] font-medium tracking-widest uppercase">
            Get in touch
          </p>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Contact
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Spotted incorrect information about a pioneer? Have a suggestion or
            question? Send us a message — we read every one.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
        <ContactForm />
      </div>
    </div>
  );
}
