import model, { StoreModel } from "@/lib/store/social-model";
import { createStore, createTypedHooks } from "easy-peasy";

const store = createStore<StoreModel>(model);
const typedHooks = createTypedHooks<StoreModel>();

export const { useStoreActions, useStoreState, useStoreDispatch } = typedHooks;
export default store;
