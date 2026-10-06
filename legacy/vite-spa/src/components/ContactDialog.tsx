import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Linkedin, Github, Copy, Check, MessageSquare, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";
import { Language, translations } from "@/lib/translations";

interface ContactDialogProps {
  triggerClassName?: string;
  language?: Language;
}

export default function ContactDialog({ triggerClassName, language = "da" }: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const t = translations[language];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} ${language === "da" ? "er kopieret til udklipsholderen!" : "was copied to the clipboard!"}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mailtoSubject = encodeURIComponent(language === "da" ? "Henvendelse vedrørende stilling eller projekt" : "Inquiry regarding role or project");
  const mailtoBody = encodeURIComponent(language === "da" ? "Hej Nassim,\n\nJeg har set dit CV og portfolio på denne profil og vil gerne høre mere om..." : "Hi Nassim,\n\nI saw your CV and portfolio and would like to learn more about...");
  const mailtoUrl = `mailto:naselh01@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={`gap-2 rounded-full font-semibold shadow-md transition-all hover:scale-105 ${triggerClassName || "bg-accent text-accent-foreground hover:bg-accent/90"}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === "da" ? "Ræk ud / Kontakt" : "Reach out / Contact"}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-2xl font-display font-bold">
            {t.contactDialog.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {t.contactDialog.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t.contactDialog.email}</p>
                <p className="text-sm font-medium text-foreground">naselh01@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard("naselh01@gmail.com", "Email")}
                title={language === "da" ? "Kopiér email" : "Copy email"}
              >
                {copiedKey === "Email" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button asChild size="sm" variant="outline" className="h-8 gap-1 text-xs">
                <a href={mailtoUrl}>
                  {t.contactDialog.sendMail}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t.contactDialog.phone}</p>
                <p className="text-sm font-medium text-foreground">+45 24 77 07 84</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard("+4524770784", "Phone number")}
                title={language === "da" ? "Kopiér telefonnummer" : "Copy phone number"}
              >
                {copiedKey === "Phone number" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button asChild size="sm" variant="outline" className="h-8 gap-1 text-xs">
                <a href="tel:+4524770784">
                  {t.contactDialog.call}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button asChild variant="outline" className="w-full gap-2 justify-start h-11 text-xs sm:text-sm">
              <a href="https://www.linkedin.com/in/nassim-hassani-63835a220" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{t.contactDialog.linkedin}</span>
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full gap-2 justify-start h-11 text-xs sm:text-sm">
              <a href="https://github.com/NassimElH01" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 shrink-0" />
                <span>{t.contactDialog.github}</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground border-t border-border">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{t.contactDialog.response}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
