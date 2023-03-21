from users.forms import *


def users_forms(request):
    sign_up_form = SignUpForm()
    context = {
        'sign_up_form': sign_up_form
    }
    return context
