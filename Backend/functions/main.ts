import createBookmark from "./createBookmark";
import deleteBookmark from "./deleteBookmark";
import getBookmarks from "./getBookmarks";
import updateBookmark from "./updateBookmark";

import Bookmark from "./BookmarksType";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    bookmarkId: string;
    bookmark: Bookmark;
  };
};

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "createBookmark":
      return await createBookmark(event.arguments.bookmark);
    case "getBookmarks":
      return await getBookmarks();
    case "deleteBookmark":
      return await deleteBookmark(event.arguments.bookmarkId);
    case "updateBookmark":
      return await updateBookmark(event.arguments.bookmark);
    default:
      return null;
  }
};
