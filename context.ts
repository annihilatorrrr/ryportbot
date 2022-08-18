import {
  ChatTypeContext,
  CommandContext,
  Context as BaseContext,
  Filter,
  LazySessionFlavor,
  Message,
  NextFunction,
  ParseMode,
} from "./deps.ts";

export interface SessionData {
  dnd: boolean; // Do not disturb mode status
  interval?: [number, number]; // Unavailability [StartHour, EndHour]
  tz?: string; // User's entered timezone
}

interface CustomContextFlavor {
  alert(text: string): Promise<true>;
  comment(text: string, options?: ParseMode): Promise<Message.TextMessage>;
}

export type Context =
  & BaseContext
  & LazySessionFlavor<SessionData>
  & CustomContextFlavor;

type GroupContext = ChatTypeContext<Context, "group" | "supergroup">;

export type ReportContext =
  | CommandContext<GroupContext>
  | Filter<
    GroupContext,
    "msg:entities:mention" | "msg:caption_entities:mention"
  >;

export async function customMethods(ctx: Context, next: NextFunction) {
  ctx.alert = (text: string) =>
    ctx.answerCallbackQuery({ text, show_alert: true });
  ctx.comment = (text: string, parseMode?: ParseMode) =>
    ctx.reply(text, { parse_mode: parseMode });
  await next();
}
