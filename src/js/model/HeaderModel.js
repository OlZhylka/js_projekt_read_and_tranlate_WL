import {child, get, getDatabase, onValue, ref} from "firebase/database";
import {getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
import ContentView from "../view/ContentView";

function HeaderModel() {
    let self = this;
    let headerView = null;

    const db = getDatabase();
    this.init = function (_headerView) {
        headerView = _headerView;
        self.toggleButtonHeader
    }
    this.getStorage = function (key) {
        return JSON.parse(localStorage.getItem(key));
    }
    this.setStorage = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    let user = this.getStorage('user');

    this.login = async function (email, password) {
        let auth = getAuth();
        if (email && password) {
            await signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    await self.getUser(user.email);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(`Code: ${errorCode}, Error: ${errorMessage}` )
                });

        }
    }

    this.getUser = async function (email){
        let id = 'id_'+email.replace('.', '_')
        await get(child(ref(db), `${id}/`)).then((snapshot) => {
            let data = snapshot.val();
            data.email = email;
            self.setStorage('user', data);
            headerView.assignUser(data.username);
        });
    }
    this.toggleButtonHeader=function (){
        user = this.getStorage('user');
        if (user) {
            headerView.assignUser(user.username);
        } else {
            headerView.signOutUser();
        }
    }
    this.outFromAccount = async function (){
        const auth = getAuth();
        await signOut(auth).then(() => {
            localStorage.removeItem('user')
            self.toggleButtonHeader()
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });

    }
}
export default HeaderModel;
