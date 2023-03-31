import { clearInterval } from "timers";
import { assign, createMachine } from "xstate";
import Song from "../../models/song/song";



export const machine = 
/** @xstate-layout N4IgpgJg5mDOIC5QDMwBcDGALAlgOygCUwMB7AW3LDwkgDoAZUgQwnygGIJS8w78AbqQDWfVJlwFiZStVoRGLNgQSDSGZmhw8A2gAYAuvoOJQAB1KwcWnqZAAPRADYAnHQAsADgDs7l+4AmTxcfdwBGAIAaEABPRABaAKc6AL8XML0XPTCAVicnbIBfQujxbHZpCioaeiZWdg4wACcm0ia6MwAbTWQ28joyySISKrlapXZVPCENGzxjYzsLKzm7RwRwgGYUpx9vJ3dNgJy86LiEeIjtoIiXAL13dz0nffdi0vRyqRHZGoUAURabQ49lgaE0fGYyDQzQAFDk9IiAJQcQYVH7VeR0QGtJqLJAgZbWbR4NaILx6OjZTw5dJ6bwuJzHM4JMKeOg+MJZTwPNKbI5OYolEB4Ui0eAEtHfGSYyBLSzE2wE9YBMIeUL+IIhXwRFkXAL3OjavzebLPNIBd4gKXDGVjBR1ZRQeUrElkhAZZJ6DVONkFPRBTx6y78uibCJ+AN+TYM3JWm2VX5Yx1yglE1bKxBhGMpJ6+7wBI5BAruPUuNw8pybSOPasFlzxz5DROygFApouxWkzMIbwFjyHbxFzyPJ4uYMRjmZcIMvyeTybIpCoA */
createMachine({
    schema:{
        services: {} as {
            "fetchRecommendedSongs":{
                data: Song[]
            }
        }
    },
    tsTypes:{} as import("./machine.typegen").Typegen0,
    context:{
        songs: [] as Song[]
    },
    states: {
        Loading: {
            invoke:{
                src: "fetchRecommendedSongs",
                onDone: {
                    target: "Loaded",
                    actions: "assignData"
                },
                onError: "Error"
            }
        },

        Loaded: {
        },

        Error:{
            after:{
                5000: "Loading"
            }
        }
    },
    

    initial: "Loading",
    id: "fetchingRecommended"
},{
    actions:{
        assignData: assign((context, event)=>{
            return {
                songs: event.data
            }
        })
    }
});