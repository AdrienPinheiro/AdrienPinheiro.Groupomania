import axios from "axios";

// Posts

export const GET_TOPICS = "GET_TOPICS";
export const ADD_TOPIC = "ADD_TOPIC";
export const LIKE_TOPIC = "LIKE_TOPIC";
export const UNLIKE_TOPIC = "UNLIKE_TOPIC";
export const UPDATE_TOPIC = "UPDATE_TOPIC";
export const DELETE_TOPIC = "DELETE_TOPIC";

export const getTopics= (num) => {
    return (dispatch) => {
        return axios
            .get(`${process.env.REACT_APP_API_URL}topic`)
            .then((res) => {
                const array = res.data.slice(0, num)
                dispatch({type: GET_TOPICS, payload: array})
            })
            .catch(err => console.log(err))
    }
}

export const addTopic = (data) => {
    return (dispatch) => {
        return axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}topic`,
            data
        })
}}

export const likeTopic = (topicId, userId) => {
    return (dispatch) => {
        return axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}topic/likeOrUnlike/` + topicId,
            data: {
                id: userId,
                likeStatus: 1
            }
        })
        .then((res) => {
            dispatch({type: LIKE_TOPIC, payload: {topicId, userId}})
        })
        .catch((err) => console.log(err))
    }
}

export const unLikeTopic = (topicId, userId) => {
    return (dispatch) => {
        return axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}topic/likeOrUnlike/` + topicId,
            data: {
                id: userId,
                likeStatus: 0
            }
        })
        .then((res) => {
            dispatch({type: UNLIKE_TOPIC, payload: {topicId, userId}})
        })
        .catch((err) => console.log(err))
    }
}

export const updateTopic = (topicId, content) => {
    return (dispatch) => {
        return axios ({
            method: "put",
            url: `${process.env.REACT_APP_API_URL}topic/${topicId}`,
            data: {content}
        })
        .then((res) => {
            dispatch({type: UPDATE_TOPIC, payload: {content, topicId}});
        })
        .catch((err) => console.log(err));
    }
}

export const deleteTopics = (topicId) => {
    return (dispatch) => {
        return axios ({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}topic/${topicId}`
        })
        .then((res) => {
            dispatch({type: DELETE_TOPIC, payload: {topicId}});
        })
        .catch((err) => console.log(err));
    }
}