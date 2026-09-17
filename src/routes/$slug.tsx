import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useLocation } from "@tanstack/react-router";

import { InvitationExperience } from "@/components/invitation/InvitationView";
import {
  ErrorScreen,
  FallbackScreen,
  LoadingScreen,
  NotFoundScreen,
} from "@/components/invitation/StateScreens";
import { fetchInvitation } from "@/lib/invitation";
import { resolveSlug } from "@/lib/slug";
import { isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title: "Wedding Invitation — You Are Cordially Invited" },
      {
        name: "description",
        content:
          "An ink-and-calligraphy digital wedding invitation: events, venue, gallery and family contacts.",
      },
      { property: "og:title", content: "Wedding Invitation — You Are Cordially Invited" },
      {
        property: "og:description",
        content: "Open the invitation to see the wedding events, venue and gallery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitationRoute,
});

function InvitationRoute() {
  const { pathname } = useLocation();
  const slug = resolveSlug(pathname);

  const query = useQuery({
    queryKey: ["invitation", slug],
    queryFn: () => fetchInvitation(slug!),
    enabled: Boolean(slug) && isSupabaseConfigured,
    retry: 1,
    staleTime: 60_000,
  });

  if (!slug) return <NotFoundScreen />;
  if (!isSupabaseConfigured) {
    return <ErrorScreen onRetry={() => window.location.reload()} detail="Invitation service unavailable" />;
  }
  if (query.isPending || query.isLoading) return <LoadingScreen />;
  if (query.isError || !query.data) return <ErrorScreen onRetry={() => void query.refetch()} />;

  const data = query.data;
  if (data.state === "not_found") return <NotFoundScreen />;
  if (data.state === "fallback") {
    return (
      <FallbackScreen shop={data.shop} />
    );
  }
  return <InvitationExperience data={data} />;
}
