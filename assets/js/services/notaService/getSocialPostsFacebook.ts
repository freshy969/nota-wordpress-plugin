import { getSocialPosts } from "assets/js/services/notaService/getSocialPosts";
import { NotaService } from 'assets/js/services/types'

export const getSocialPostsFacebook: NotaService['getSocialPostsFacebook'] = ({
    postHTML,
    count,
}) => {
    return getSocialPosts({
        postHTML,
        platform: 'facebook',
        count,
    })
}