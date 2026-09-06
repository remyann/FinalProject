<Login user={user}/>
    <Welcome user={user}/>
        <User user={user}/>
            <Profile user={user}/>


------
Context:
Context.Provider value={user}

<Login/>
    <Welcome/>
        <User/>
            <Profile/>
                {user} = useContext(Context)