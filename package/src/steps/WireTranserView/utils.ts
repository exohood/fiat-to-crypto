export const copyToClipBoard = async (
  text: string,
  copied: (status: boolean, text: string) => void
) => {
  try {
    await navigator.clipboard.writeText(text);
    copied(true, text);
  } catch (err) {
    copied(false, text);
  }
};
