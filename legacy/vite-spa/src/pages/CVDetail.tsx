import { useLocation, Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, CheckCircle2, FileQuestion } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCVItemById } from "@/data/cvData";

export default function CVDetail() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const cvData = location.state?.cvData || (id ? getCVItemById(id) : undefined);

  if (!cvData) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileQuestion className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold">Erfaring ikke fundet</h1>
        <p className="text-muted-foreground">
          Den ønskede profil eller erfaring kunne desværre ikke findes.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tilbage til oversigten
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button variant="ghost" asChild className="mb-8">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Tilbage til forsiden
        </Link>
      </Button>
      
      <div className="space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary">{cvData.type}</Badge>
            <span className="text-sm text-muted-foreground font-medium">{cvData.period}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {cvData.title}
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground mb-4">
            {cvData.organization}
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border">
            {cvData.description}
          </p>
        </div>
        
        {cvData.bullets && cvData.bullets.length > 0 ? (
          <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Nøgleopgaver & Læringspunkter
                </CardTitle>
                <CardDescription>
                  Væsentlige ansvarsområder og faglige kompetencer opbygget i forløbet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-300 list-disc pl-5 marker:text-primary">
                  {cvData.bullets.map((bullet, index) => (
                    <li key={index} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {cvData.personalCompetencies && cvData.personalCompetencies.length > 0 && (
              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    Personlige kompetencer
                  </CardTitle>
                  <CardDescription>
                    Kompetencer og arbejdsstyrker, jeg har udviklet gennem dette arbejde.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cvData.personalCompetencies.map((competency) => (
                      <Badge key={competency} variant="outline" className="px-3 py-1.5 text-sm">
                        {competency}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[250px] bg-slate-50/50 dark:bg-slate-900/20 mt-8">
            <h3 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Yderligere Dokumentation
            </h3>
            <p className="text-muted-foreground max-w-md">
              Relevante certifikater og udtalelser for denne stilling kan fremsendes ved henvendelse.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
