import * as $ from 'jquery'

function createAnalytics() {
    let counter = 0
    let destroyed = false

    const listener = () => counter++

    $(document).on('click', listener)

    return {
        destroy() {
            $(document).off('click', listener)
            isDestroyed = true
        },

        getClicks() {
            if (isDestroyed) {
                return `Analytics is destroyed. Total clicks = ${couner}`
            }
            return counter
        }
    }
}

window.analytics = createAnalytics()