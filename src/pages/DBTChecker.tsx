import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Search, Shield, History, Trash2, AlertCircle, CheckCircle2, HelpCircle, Link2 } from "lucide-react";
import { useDBTChecker } from "@/hooks/useDBTChecker";
import { format } from "date-fns";

const dbtCheckSchema = z.object({
  aadhaarNumber: z
    .string()
    .length(12, "Aadhaar number must be 12 digits")
    .regex(/^\d+$/, "Aadhaar number must contain only digits"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

type FormData = z.infer<typeof dbtCheckSchema>;

export default function DBTChecker() {
  const navigate = useNavigate();
  const { checkDBTStatus, fetchHistory, deleteCheck, loading, history, historyLoading } = useDBTChecker();

  const form = useForm<FormData>({
    resolver: zodResolver(dbtCheckSchema),
    defaultValues: {
      aadhaarNumber: "",
      fullName: "",
    },
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const onSubmit = async (data: FormData) => {
    const result = await checkDBTStatus(data.aadhaarNumber, data.fullName);
    
    if (result) {
      navigate("/checker/result", { state: { result } });
      form.reset();
      fetchHistory();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "linked":
        return <Badge variant="default" className="bg-green-600">Linked</Badge>;
      case "seeded":
        return <Badge variant="secondary">Seeded</Badge>;
      case "not_linked":
        return <Badge variant="destructive">Not Linked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">DBT Status Checker</h1>
        </div>
        <p className="text-muted-foreground">
          Verify your Aadhaar and DBT linking status
        </p>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle>How It Works</CardTitle>
            </div>
            <CardDescription>
              Understand DBT linking and check your status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-is-dbt">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    What is DBT?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Direct Benefit Transfer (DBT) is a government initiative to transfer subsidies 
                  and benefits directly to citizens' bank accounts. It ensures transparency, 
                  reduces delays, and eliminates middlemen in benefit delivery.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="linked-vs-seeded">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-primary" />
                    Difference: Aadhaar-Linked vs Aadhaar-Seeded
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">✅ Aadhaar-Linked (Verified)</p>
                    <p>
                      Your bank account is verified with NPCI using your Aadhaar number. 
                      This is required to receive government benefits through DBT. The bank 
                      has validated your Aadhaar with the UIDAI database.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">⚠️ Aadhaar-Seeded (Not Verified)</p>
                    <p>
                      Your Aadhaar number is recorded in your bank account, but not yet 
                      verified with NPCI. You need to complete the verification process at 
                      your bank to receive DBT benefits.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how-to-use">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    How to Use This Checker
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-muted-foreground">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Enter your 12-digit Aadhaar number</li>
                    <li>Enter your full name as per Aadhaar card</li>
                    <li>Click "Check Status" to verify your DBT linkage</li>
                    <li>View your status and get recommendations for next steps</li>
                  </ol>
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      This is a demo tool. For real verification, visit your bank or 
                      check at <strong>www.npci.org.in</strong>
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="next-steps">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    What to Do After Checking?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-muted-foreground">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-foreground">If Linked ✅</p>
                      <p>Great! You can receive DBT benefits. Keep your bank account active.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">If Seeded ⚠️</p>
                      <p>Visit your bank branch with your Aadhaar card to complete verification.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">If Not Linked ❌</p>
                      <p>Visit your bank immediately with Aadhaar card to start the linking process.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verification Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Check DBT Status</CardTitle>
            <CardDescription>
              Enter your Aadhaar number and name to verify your DBT account linkage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                <Input
                  id="aadhaarNumber"
                  type="text"
                  placeholder="Enter 12-digit Aadhaar number"
                  {...form.register("aadhaarNumber", {
                    onChange: (e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                      form.setValue("aadhaarNumber", value);
                    }
                  })}
                  maxLength={12}
                />
                {form.formState.errors.aadhaarNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.aadhaarNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking Status...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check Status
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Tips */}
      <Alert className="border-primary/20">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> This is a demo verification system. For actual DBT status 
          verification, please visit your bank branch or check online at the official NPCI website 
          (<strong>www.npci.org.in</strong>).
        </AlertDescription>
      </Alert>

      {/* Check History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  <CardTitle>Check History</CardTitle>
                </div>
                <Badge variant="secondary">{history.length} checks</Badge>
              </div>
              <CardDescription>Your recent DBT status checks</CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((check) => (
                    <div
                      key={check.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{check.fullName}</p>
                          {getStatusBadge(check.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Checked on {format(new Date(check.createdAt), "PPp")}
                        </p>
                        {check.bankName && (
                          <p className="text-sm text-muted-foreground">
                            Bank: {check.bankName}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCheck(check.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
