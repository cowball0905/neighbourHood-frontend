import { getUser } from "~/api/auth";
import type { User } from "~/types/common";

const user = ref<User>();

export function useUser(){
    onMounted(async ()=>{
        const [error, data,options] = await getUser();
        if (!error && data) {
            user.value = data.data;
        }
    })

    return{
        user
    }
}
