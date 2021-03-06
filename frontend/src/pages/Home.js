import { useContext } from "react";
import { UidContext } from "../components/AppContext";
import NewTopicForm from "../components/Post/NewTopicForm";
import Thread from "../components/Thread"
import Log from "../components/Log";



const Home = () => {

    const uid = useContext(UidContext);

    return(
        <div className="home">
            <div className="main">
                <div className="home-header">
                    {
                        uid ? <NewTopicForm/> : <Log signin={true} signup={false}/>
                    }
                </div>
                <Thread/>
            </div>
        </div>
    )

}

export default Home;