export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Workspace {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}

export type PlanId = "starter" | "pro" | "business" | "agency";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "incomplete";

// ── Social ────────────────────────────────────────────────────────────────────
export type Platform = "instagram" | "facebook" | "tiktok";
export type PostStatus = "draft" | "scheduled" | "publishing" | "published" | "failed";
export type MessageDirection = "inbound" | "outbound";

export interface SocialAccount {
  id: number;
  platform: Platform;
  username: string;
  display_name: string;
  avatar_url: string | null;
  followers_count: number;
  connected_at: string;
}

export interface ScheduledPostAccount {
  id: number;
  platform: Platform;
  username: string;
}

export interface ScheduledPost {
  id: number;
  caption: string | null;
  media_urls: string[];
  scheduled_at: string;
  status: PostStatus;
  error_message: string | null;
  created_at: string;
  accounts: ScheduledPostAccount[];
}

export interface ScheduledPostCreate {
  caption?: string;
  media_urls?: string[];
  scheduled_at: string;
  social_account_ids: number[];
}

export interface ConversationOut {
  id: number;
  platform: Platform;
  contact_name: string;
  contact_avatar_url: string | null;
  unread_count: number;
  last_message_at: string | null;
  last_message_text: string | null;
  social_account_username: string;
}

export interface MessageOut {
  id: number;
  direction: MessageDirection;
  text: string;
  sent_at: string;
}

export interface ConversationDetailOut extends ConversationOut {
  messages: MessageOut[];
}

export interface PlatformStats {
  platform: Platform;
  username: string;
  followers_count: number;
  posts_count: number;
}

export interface AnalyticsOverview {
  total_followers: number;
  total_posts: number;
  platforms: PlatformStats[];
}

export interface Subscription {
  plan_id: PlanId;
  status: SubscriptionStatus;
  trial_ends_at: string | null;
  current_period_end: string | null;
}
