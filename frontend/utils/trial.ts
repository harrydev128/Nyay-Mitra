import { supabase } from "../services/supabase";

export const checkTrialStatus = async (userId: string) => {
  const { data } = await supabase
    .from("profiles")
    .select("trial_start_date, trial_used, plan, premium_expiry, referred_by")
    .eq("id", userId)
    .single();

  if (!data) return { hasAccess: false, daysLeft: 0, isPremium: false };

  // Premium plan check
  if (data.plan !== "free") {
    if (data.premium_expiry) {
      const expiry = new Date(data.premium_expiry);
      if (expiry > new Date()) return { hasAccess: true, daysLeft: 0, isPremium: true };
    }
  }

  // Trial check
  if (data.trial_start_date) {
    const start = new Date(data.trial_start_date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = 7 - diffDays;
    if (daysLeft > 0) return { hasAccess: true, daysLeft, isPremium: false };
  }

  return { hasAccess: false, daysLeft: 0, isPremium: false };
};

export const startTrial = async (userId: string) => {
  await supabase
    .from("profiles")
    .update({ trial_start_date: new Date().toISOString(), trial_used: true })
    .eq("id", userId);
};

export const applyReferralExtension = async (userId: string) => {
  const { data } = await supabase
    .from("profiles")
    .select("trial_start_date")
    .eq("id", userId)
    .single();

  if (!data?.trial_start_date) return;

  const current = new Date(data.trial_start_date);
  current.setDate(current.getDate() + 7); // +7 days extension

  await supabase
    .from("profiles")
    .update({ trial_start_date: current.toISOString() })
    .eq("id", userId);
};
