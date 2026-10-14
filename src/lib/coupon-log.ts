import { supabase } from "@/integrations/supabase/client";

/**
 * Registra (de forma anônima) que alguém liberou o acesso com o cupom educacional.
 * Nunca bloqueia o fluxo do usuário — falhas são silenciosas.
 */
export async function logCouponRedemption(couponCode: string) {
  try {
    await supabase.from("coupon_redemptions").insert({
      coupon_code: couponCode,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 400) : null,
    });
  } catch {
    // ignora
  }
}
