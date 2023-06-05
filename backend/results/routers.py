from rest_framework import routers


class ResultRouter(routers.SimpleRouter):
    routes = [

        routers.Route(
            url=r'^{prefix}{trailing_slash}$',
            mapping={
                'post': 'create_result',
            },
            name='create_result',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),

        routers.Route(
            url=r'^tests/(?P<test_pk>[^/.]+)/{prefix}{trailing_slash}$',
            mapping={
                'get': 'get_result_list',
            },
            name='get_result',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),

        routers.Route(
            url=r'^{prefix}/{lookup}{trailing_slash}$',
            mapping={
                'get': 'get_result',
                'patch': 'update_result',
            },
            name='result_object',
            detail=True,
            initkwargs={'suffix': 'Instance'}
        ),

    ]
