import { useEffect } from "react";

const Home = () => {

    useEffect(() => {
        document.title = 'דף הבית'
    }, [])

    return <>
        <div className="img-i ">
            <div className="text-home">
         ברוכים הבאים לאתר המתכונים שלנו
         </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h3 className="animate-charcter"> בתאבון:)</h3>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default Home;