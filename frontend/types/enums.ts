export type BookCategory =
  | "Undefined"
  | "Mandarin"
  | "World"
  | "GenreFic"
  | "LightNovel"
  | "Manga"
  | "Bl"
  | "Gl"
  | "History"
  | "Poem"
  | "Art"
  | "Philisophy"
  | "Religion"
  | "Biography";

export type BookCondition =
  | "New"
  | "LikelyNew"
  | "Good"
  | "Fair"
  | "Poor"
  | "Bad";

export type DeliveryMethod =
  | "Undefined"
  | "FaceToFace"
  | "Mail"
  | "ConvenienceStore"
  | "Other";

export type PayMethod = "Undefined" | "Cash" | "BankTransfer" | "Other";

export type UserBookStatus =
  | "Drafted"
  | "Listed"
  | "Reserved"
  | "WaitForConfirmation"
  | "InProgress"
  | "Completed"
  | "Delisted";
