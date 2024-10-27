module default {
    scalar type messageno extending sequence;

    type Account{
        name: str;
        password: str;
        avatar: bytes;
        multi joined: GroupServer{
            on target delete allow;
            on source delete delete target;
        };
    }

    type GroupServer{
        name: str;
        owner: str;
        image: bytes;
        multi users: Account{
            on target delete allow;
            };
        multi messages: Messages{
            on target delete allow;
            on source delete delete target;
        };
    }

    type Messages{
        data: str;
        position: messageno {
            constraint exclusive;
            };
        postedby: Account;
    }

}
