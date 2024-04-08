export default function Protected(props) {
    return props.isLogged && props.children
}
