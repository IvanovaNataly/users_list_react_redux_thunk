import React from "react";
import {connect} from "react-redux";
import UserDetails from "./UserDetails";
import UserPosts from "./UserPosts";
import Notification from "./Notification";
import {getUser, addToFriends} from "../../../actions/creators";

import "./user-page.scss";


class UserPage extends React.Component {

    constructor(props){
        super(props);

        if( props.match.params.id ){
            props.getUser(props.match.params.id);
        }
    }

    componentWillReceiveProps( {match, friendsIds} ){
        if( match.params.id &&  match.params.id != this.props.match.params.id){
            this.props.getUser(match.params.id);
            this.notificationMsg = null;
            this.buttonAppear = null;
        }
        if(friendsIds.length > this.props.friendsIds.length) {
            this.notificationMsg = this.props.user.name + " is your new friend now."
        }
    }

    onAddToFriends() {
        this.props.addToFriends(this.props.user.id);
    }

    buttonEval() {
        if (!this.props.friendsIds.find( id => this.props.user.id == id))
            return <button className="btn-add-friend" onClick={this.onAddToFriends.bind(this)}>Add To Friends</button>
    }

    notificatonEval() {
        if (this.notificationMsg)
            return <Notification msg={ this.notificationMsg } classHidden="notification" />
    }

    render() {
        if(this.props.isLoading)
            return <main className="user-page">Loading...</main>;

        return (<main className="user-page">
                    {this.buttonEval()}
                    {this.notificatonEval()}
                    <UserDetails user={ this.props.user }/>
                    <UserPosts posts={ this.props.posts }/>
                </main>)
    }
}

function mapStateToProps(state){
    return {
        isLoading: state.friends.selectedUser.isLoading,
        user: state.friends.selectedUser.details,
        posts: state.friends.selectedUser.posts,
        friendsIds: state.friendsList.friendsIds
    }
}

function mapDispatchToProps(dispatch){
    return {
        getUser: id => dispatch( getUser(id) ),
        addToFriends: id => dispatch( addToFriends(id) )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
