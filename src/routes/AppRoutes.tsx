import { Route, Routes } from "react-router-dom";
import Account from "../pages/Account/Account";
import AddMenu from "../pages/add_new_song/AddMenu/AddMenu";
import Parse from "../pages/add_new_song/AddMenu/Upload/components/Parse/Parse";
import Documentation from "../pages/Documentation/Documentation";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import GroupScreen from "../pages/GroupHome/GroupScreen";
import MySongsList from "../pages/MySongsList/MySongsList";
import PlaylistScreen from "../pages/Playlist/PlaylistScreen";
import PlaylistCards from "../pages/PlaylistCards/PlaylistCards";
import PlaylistsList from "../pages/PlaylistsList/PlaylistsList";
import SongRoutePage from "../pages/Sheet/SongRoutePage";
import SignUp from "../pages/SignUp/SignUp";
import Test from "../pages/Test/Test";
import { routesPaths as p } from "./routes";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Upload from "../pages/add_new_song/AddMenu/Upload/Upload";
import Create from "../pages/add_new_song/Write/Create";
import List from "../pages/List/List";
import TestComponents from "../pages/TestComponents/TestComponents";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path={p.home} element={<Home />} />
            <Route path={p.songsList} element={<List />} />
            <Route path={p.login} element={<Login />} />
            <Route path={p.signup} element={<SignUp />} />
            <Route path={p.account} element={<Account />} />
            <Route path={p.usersPlaylists} element={<PlaylistsList />} />
            <Route path={p.usersSongs} element={<MySongsList />} />
            <Route path={p.variant} element={<SongRoutePage />} />
            <Route path={p.addMenu} element={<AddMenu />} />
            <Route path={p.upload} element={<Upload />} />
            <Route path={p.uploadParse} element={<Parse />} />
            <Route path={p.writeSong} element={<Create />} />
            <Route path={p.playlist} element={<PlaylistScreen />} />
            <Route path={p.playlistCards} element={<PlaylistCards />} />
            <Route path={p.documentation} element={<Documentation />} />
            <Route path={p.group + "/*"} element={<GroupScreen />} />
            <Route path={p.test} element={<Test />} />
            <Route path={p.testComponents} element={<TestComponents />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
};
