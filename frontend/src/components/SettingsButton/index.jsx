import useUser from "@/hooks/useUser";
import paths from "@/utils/paths";
import { ArrowUUpLeft, Wrench } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";

export default function SettingsButton() {
  const isInSettings = !!useMatch("/settings/*");
  const { user } = useUser();

  if (user && user?.role === "default") return null;

  if (isInSettings)
    return (
      <div className="flex w-fit">
        <Link
          to={paths.home()}
          className="transition-all duration-300 p-2 rounded-full bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover hover:shadow-md transform hover:scale-105"
          aria-label="返回首页"
          data-tooltip-id="footer-item"
          data-tooltip-content="返回工作区"
        >
          <ArrowUUpLeft
            className="h-5 w-5"
            weight="fill"
            color="var(--theme-sidebar-footer-icon-fill)"
          />
        </Link>
      </div>
    );

  return (
    <div className="flex w-fit">
      <Link
        to={paths.settings.interface()}
        className="transition-all duration-300 p-2 rounded-full bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover hover:shadow-md transform hover:scale-105"
        aria-label="设置"
        data-tooltip-id="footer-item"
        data-tooltip-content="打开设置"
      >
        <Wrench
          className="h-5 w-5"
          weight="fill"
          color="var(--theme-sidebar-footer-icon-fill)"
        />
      </Link>
    </div>
  );
}
