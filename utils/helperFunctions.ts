export function matchYoutubeUrl(url: string) {
  var p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  const matchResult = url.match(p);
  if (matchResult) {
    return matchResult[1];
  }
  return false;
}
