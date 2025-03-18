import "../Css/DashBoard.css"
import AccessList from "./AccessList"
import NewRegister from "./NewRegister"
import SideMenu from "./SideMenu"
import { BrowserRouter , Routes , Route } from "react-router-dom"
import WritePost from "./WritePost"
import AllBlogs from "./AllBlogs"
import { Outlet, Navigate } from "react-router-dom";
export default function DashBoard(){
    return (
        <>
        <div className="dashBoard-Parent">
            <SideMenu />
          <div className="DashBoardContent">
            <Routes>
            <Route path="/" element={<Outlet />}>
            
            <Route path="/AccessList" element={<AccessList />} />
             <Route path="/WritePost" element={<WritePost />} /> 
             <Route index path="/AllBlogs" element={<AllBlogs/>} />
             <Route path="/NewRegister" element={<NewRegister />} />
            
            
            </Route>
            
            </Routes>
          </div>

        </div>
        
        </>
    )
}