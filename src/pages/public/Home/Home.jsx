import FooterHome from "./components/FooterHome";
import HeroHome from "./components/HeroHome";
import InfoHome from "./components/InfoHome";
import NavbarComponent from "./components/NavbarHome";
import ReviewsHome from "./components/ReviewsHome";
import StatsBar from "./components/StatsBar";
import StepsHome from "./components/StepsHome";

const Home = () => {
    return (
        <div className="flex flex-col min-h-dvh bg-white">
            <NavbarComponent />
            <main className="flex-1">
                <HeroHome />
                <StatsBar />
                <InfoHome />
                <StepsHome />
                <ReviewsHome />
            </main>
            <FooterHome />
        </div>
    );
};

export default Home;