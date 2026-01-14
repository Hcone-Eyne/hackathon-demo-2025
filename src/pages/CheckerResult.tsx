import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, AlertCircle, XCircle, Building2, CreditCard, Share2 } from "lucide-react";
import { DBTCheckResult } from "@/hooks/useDBTChecker";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

export default function CheckerResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result as DBTCheckResult | undefined;

  if (!result) {
    navigate("/dashboard/checker");
    return null;
  }

  const getStatusConfig = () => {
    switch (result.status) {
      case "linked":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-950",
          borderColor: "border-green-200 dark:border-green-800",
          badge: "success",
          title: "Aadhaar Linked",
        };
      case "seeded":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 dark:bg-yellow-950",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          badge: "warning",
          title: "Aadhaar Seeded",
        };
      case "not_linked":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-950",
          borderColor: "border-red-200 dark:border-red-800",
          badge: "destructive",
          title: "Not Linked",
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  const handleShare = async () => {
    const text = `DBT Status: ${config.title}\n${result.message}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (error) {
        logger.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="flex items-center h-14 px-4 max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/checker")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Verification Result</h1>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-4 space-y-6"
      >
        {/* Status Card */}
        <Card className={`border-2 ${config.borderColor} ${config.bgColor}`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${config.bgColor}`}>
                <StatusIcon className={`h-12 w-12 ${config.color}`} />
              </div>
            </div>
            <CardTitle className="text-2xl">{config.title}</CardTitle>
            <Badge variant={config.badge as any} className="mt-2">
              {result.status.toUpperCase().replace("_", " ")}
            </Badge>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-base">
                {result.message}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Bank Details Card (if available) */}
        {(result.bankName || result.accountNumberLast4) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Bank Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.bankName && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Bank Name:</span>
                  <span className="font-medium">{result.bankName}</span>
                </div>
              )}
              {result.accountNumberLast4 && (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Account:</span>
                  <span className="font-medium">****{result.accountNumberLast4}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recommendations Card */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>What you should do next</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {result.status === "linked" ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>You can receive DBT payments directly to your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Ensure your bank details are up to date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Register for eligible government schemes</span>
                  </li>
                </>
              ) : result.status === "seeded" ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Visit your bank to complete the linking process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Carry your Aadhaar card and bank passbook</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Ask for DBT linking at the bank counter</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Visit your nearest bank branch with Aadhaar card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Request for Aadhaar-bank account linking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>This enables you to receive DBT benefits</span>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate("/dashboard/checker")}
            className="flex-1"
            size="lg"
          >
            Check Again
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Result
          </Button>
        </div>

        {/* Disclaimer */}
        <Alert>
          <AlertDescription className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> This is a mock verification system for demonstration purposes only. 
            For actual DBT status verification, please visit your bank or the official NPCI website.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
}
