import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";


const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1` }),

    tagTypes: ["Chat", "User"],

    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "chat/my",
                credentials: "include",
            }),
            providesTags: ["Chat"],
        }),

        searchUser: builder.query({
            query: (name) => ({
                url: `user/search?name=${name}`,
                credentials: "include",
            }),
            provideTags: ["User"],
        }),

        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: "user/sendrequest",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        getNotifications: builder.query({
            query: () => ({
                url: `user/notifications`,
                credentials: "include",
            }),
            keepUnusedDataFor: 0,
        }),

        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: `user/acceptrequest`,
                method: "PUT",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
    }),
});

export default api;
export const {
    useMyChatsQuery,
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendRequestMutation,
} = api;
