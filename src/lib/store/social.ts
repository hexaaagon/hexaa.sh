import { createStore, createTypedHooks } from "easy-peasy";
import model, { type StoreModel } from "@/lib/store/social-model";

const store = createStore<StoreModel>(model);
const typedHooks = createTypedHooks<StoreModel>();

export const { useStoreActions, useStoreState, useStoreDispatch } = typedHooks;
export default store;
