import { CustomSVGProps } from "@/types/customSvg.types";

export const LeftArrowIcon = (props: CustomSVGProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path d="m14 17l-5-5l5-5z"></path>
    </svg>
  );
};
