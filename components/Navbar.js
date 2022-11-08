import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0';

export function Navbar(props) {
    const { user, error, isLoading } = useUser();


    return (
        <nav className="bg-gradient-to-r from-background-dark to-background-dark/70 text-white relative shadow-lg flex justify-center items-center"
             role="navigation">
            <div className={"flex justify-between items-center h-16 container"}>
                <Link href="/">
                    <p className="pl-8 hover:underline cursor-pointer">School travel</p>
                </Link>
                <div className="px-4 cursor-pointer md:hidden" onClick={props.toggle}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </div>
                <div className="pr-8 md:flex hidden flex-row">
                    <Link href="/builder">
                        <p className="p-4 hover:underline cursor-pointer">Route Builder</p>
                    </Link>
                    {
                        user ?
                            <div className={"flex flex-row items-center"}>
                                <a href="/api/auth/logout">
                                    <p className="p-4 hover:underline cursor-pointer mr-3">Logout</p>
                                </a>
                                <div className={"flex flex-col"}>
                                    <h2 className={"text-sm text-gray-200"}>{user.name}</h2>
                                    <p className={"text-xs text-gray-400"}>{user.email}</p>
                                </div>
                            </div>
                            :
                            <a href="/api/auth/login">
                                <p className="p-4 hover:underline cursor-pointer">Login</p>
                            </a>
                    }
                </div>
            </div>
        </nav>
    )
}
