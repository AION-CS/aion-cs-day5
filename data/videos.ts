import { bi, t } from "@/lib/lang";
import type { MaterialId } from "@/data/materialIndex";
import type { Video } from "@/components/materi/kit";

/**
 * Embedded videos (CLAUDE.md #33): a card gets one only where a credible video with a named channel or speaker really explains the
 * same idea. Each was checked on 2026-09-29: public, embeddable, captions present, uploader named. A card without a video is never a
 * defect. Re-check before teaching (a video can be removed): the block degrades to a note, never to a broken embed.
 * The video supplements the card; the card's own text and rules stay sufficient without it.
 */
export const VIDEOS: Partial<Record<MaterialId, Video>> = bi({
  A3: {
    title: "Market Segmentation · Stanford “Strategic Marketing of High Tech and Clean Tech”",
    channel: "Tony Seba (Stanford lecturer)",
    youtubeId: "Nl_NalRq76o",
    minutes: 39,
    optional: true,
    lang: t("English, captions available", "Englisch, Untertitel vorhanden"),
    adds: t(
      "A full university lecture on how a market is cut into segments. Watch it before or after the session if you want the idea explained at length; today's task needs only the card.",
      "Eine ganze Universitätsvorlesung dazu, wie ein Markt in Segmente geteilt wird. Sehen Sie sie vor oder nach der Sitzung, wenn Sie die Idee ausführlich erklärt haben wollen; für die heutige Aufgabe reicht die Karte.",
    ),
  },
  A4: {
    title: "How retailers can harness the power of personalization",
    channel: "McKinsey & Company",
    youtubeId: "JXIZGAR-0jE",
    minutes: 2,
    lang: t("English, captions available", "Englisch, Untertitel vorhanden"),
    adds: t(
      "A two-minute view from McKinsey on why tailoring what you offer changes results. The example is retail, not cloud; the card shows the same idea for DataCloud's kind of business.",
      "Zwei Minuten von McKinsey dazu, warum ein zugeschnittenes Angebot die Ergebnisse verändert. Das Beispiel stammt aus dem Handel, nicht aus der Cloud; die Karte zeigt dieselbe Idee für ein Unternehmen wie DataCloud.",
    ),
  },
});
