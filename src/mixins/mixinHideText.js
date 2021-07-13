const mixinHideText = {
    computed: {
        hideText: () => {
            return screen.width < 780 ? "display:none" : ""
        }
    },
}

export default mixinHideText