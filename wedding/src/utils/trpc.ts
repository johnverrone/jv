import { AppRouter } from '../server/routers/_app';
import { createReactQueryHooks } from '@trpc/react';
import { inferProcedureInput } from '@trpc/server';

export const trpc = createReactQueryHooks<AppRouter>();

/**
 * Enum containing all api query paths
 */
export type TQuery = keyof AppRouter['_def']['queries'];

/**
 * Enum containing all api mutation paths
 */
export type TMutation = keyof AppRouter['_def']['mutations'];

/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter['_def']['queries'][TRouteKey]
>;

/**
 * This is a helper method to infer the input of a mutation resolver
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferMutationInput<TRouteKey extends TMutation> =
  inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>;
