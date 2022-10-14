import React from "react";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import LeaderboardCard from "../components/LeaderboardCard";
import { selectDarkmode } from "../features/darkmodeSlice";
import { fetchalluser } from "../utils/fetchuserinfo";

function Leaderboard({ profiles }) {
  const darkMode = useSelector(selectDarkmode);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <div>
        <h1 className="font-bold text-3xl text-center">User Leaderboard</h1>
      </div>
      <main className="flex-1 h-full w-full">
        <div className="w-full flex p-4 flex-col items-center justify-center">
          {profiles.slice(0, 10).map((profile) => (
            <LeaderboardCard
              key={profile?._id}
              name={profile.name}
              email={profile.email}
              rating={profile.rating}
              postCount={profile.postCount}
              averageRating={profile.averageRating}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;
export const getServerSideProps = async ({ req, res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const profiles = await fetchalluser();

  return {
    props: {
      profiles,
    },
  };
};
