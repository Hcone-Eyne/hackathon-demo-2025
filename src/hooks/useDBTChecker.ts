import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface DBTCheckResult {
  id: string;
  status: "linked" | "seeded" | "not_linked";
  bankName?: string;
  accountNumberLast4?: string;
  message: string;
  createdAt: string;
}

interface DBTCheckHistory extends DBTCheckResult {
  aadhaarLast4: string;
  fullName: string;
}

// Query database for DBT verification using secure server-side RPC function
const queryDBTStatus = async (aadhaarNumber: string): Promise<Omit<DBTCheckResult, "id" | "createdAt"> | null> => {
  // Use secure server-side lookup function with input validation
  const { data, error } = await supabase
    .rpc('lookup_dbt_status', { aadhaar_input: aadhaarNumber });

  if (error) {
    // Log only error type, not sensitive details
    console.error("Error querying DBT status");
    return null;
  }

  if (!data || data.length === 0) {
    // No record found
    return {
      status: "not_linked",
      message: "No DBT record found for this Aadhaar number. Please visit your bank to register for DBT.",
    };
  }

  const record = data[0];
  return {
    status: record.status as "linked" | "seeded" | "not_linked",
    bankName: record.bank_name || undefined,
    accountNumberLast4: record.account_number_last4 || undefined,
    message: record.message || "DBT status retrieved successfully.",
  };
};

export function useDBTChecker() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<DBTCheckHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const checkDBTStatus = async (
    aadhaarNumber: string,
    fullName: string
  ): Promise<DBTCheckResult | null> => {
    if (!user) {
      toast.error("Please sign in to check DBT status");
      return null;
    }

    setLoading(true);

    try {
      // Query database for verification
      const result = await queryDBTStatus(aadhaarNumber);

      if (!result) {
        toast.error("Failed to verify DBT status");
        return null;
      }

      // Save check to history
      const { data, error } = await supabase
        .from("dbt_checks")
        .insert({
          user_id: user.id,
          aadhaar_number: aadhaarNumber,
          full_name: fullName,
          status: result.status,
          bank_name: result.bankName,
          account_number_last4: result.accountNumberLast4,
          message: result.message,
        })
        .select()
        .single();

      if (error) throw error;

      const checkResult: DBTCheckResult = {
        id: data.id,
        status: data.status as "linked" | "seeded" | "not_linked",
        bankName: data.bank_name || undefined,
        accountNumberLast4: data.account_number_last4 || undefined,
        message: data.message,
        createdAt: data.created_at,
      };

      toast.success("DBT status checked successfully");
      return checkResult;
    } catch (error: unknown) {
      // Don't log error details to console for security
      toast.error("Failed to check DBT status");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;

    setHistoryLoading(true);

    try {
      const { data, error } = await supabase
        .from("dbt_checks")
        .select("id, full_name, status, bank_name, account_number_last4, message, created_at, aadhaar_last4")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      setHistory(
        data?.map((item) => ({
          id: item.id,
          aadhaarLast4: item.aadhaar_last4 || 'XXXX',
          fullName: item.full_name,
          status: item.status as "linked" | "seeded" | "not_linked",
          bankName: item.bank_name || undefined,
          accountNumberLast4: item.account_number_last4 || undefined,
          message: item.message,
          createdAt: item.created_at,
        })) || []
      );
    } catch (error: unknown) {
      // Don't log error details to console for security
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteCheck = async (checkId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("dbt_checks")
        .delete()
        .eq("id", checkId)
        .eq("user_id", user.id);

      if (error) throw error;

      setHistory((prev) => prev.filter((check) => check.id !== checkId));
      toast.success("Check deleted from history");
    } catch (error: unknown) {
      // Don't log error details to console for security
      toast.error("Failed to delete check");
    }
  };

  return {
    checkDBTStatus,
    fetchHistory,
    deleteCheck,
    loading,
    history,
    historyLoading,
  };
}
