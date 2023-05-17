import Header from "../Components/Header/Header";
import Sidebar from "../Components/Sidebar/Sidebar.tsx";
import {Outlet} from "react-router";


export default function TemplatePage() {
    return <>
        <Header/>
        <div style={{display: "flex", height: "90vh"}}>
            <div>
                <Sidebar/>
            </div>
            <div style={{width: "100%", height: "100%", paddingTop: "2vh", paddingLeft: "2vh", paddingRight: "2vh"}}>
                <Outlet/>
            </div>
        </div>
    </>
}