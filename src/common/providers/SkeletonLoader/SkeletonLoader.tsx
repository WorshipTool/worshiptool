import { ComponentProps } from "react"
import { SkeletonLoaderCore } from "./SkeletonLoaderCore"

type SkeletonLoaderProps<T extends unknown[]>  =  ComponentProps<typeof SkeletonLoaderCore<T>> & {
    render: (data: T) => JSX.Element
}

export const SkeletonLoader = <T extends unknown[]>(props: SkeletonLoaderProps<T>) => {
    return <SkeletonLoaderCore {...props} />
}