import { type ReactNode } from "react";
import Header from "../pages/Home/HomeComponents/Header";
import Footer from "../pages/Home/HomeComponents/Footer";
import ScrollToTop from "@/hooks/ScrollToTop";


interface IProps {
    children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
    return (
        <div className=" min-h-screen flex flex-col mx-auto scroll-smooth">
            <ScrollToTop />
            <Header />

            <div className="grow ">{children}</div>
            <Footer />
        </div>
    );
}