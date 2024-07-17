import jammy_wallpaper from "../static/media/jammy_wallpaper.jpg";
import { ActivitiesBarComponent } from "./ActivitiesBarComponent";
import { ApplicationsMenuComponent } from "./ApplicationsMenuComponent";

export const HomeScreenComponent = () => {
  return (
    <section className="h-screen w-screen overflow-hidden relative">
      <ActivitiesBarComponent/>
      <ApplicationsMenuComponent/>
      <img 
        src={jammy_wallpaper} 
        alt="Ubuntu Jammy Wallpaper" 
        className="w-full h-full object-cover"
      />
    </section>
  )
}
