from rest_framework import routers


class TestRouter(routers.SimpleRouter):
    routes = [

        routers.Route(
            url=r'^{prefix}{trailing_slash}$',
            mapping={
                'get': 'get_tests',
                'post': 'create_test'
            },
            name='{basename}-list',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),

        routers.DynamicRoute(
            url=r'^{prefix}/{url_path}{trailing_slash}$',
            name='{basename}-{url_name}',
            detail=False,
            initkwargs={}
        ),

        routers.Route(
            url=r'^{prefix}/{lookup}{trailing_slash}$',
            mapping={
                'patch': 'update_test_description',
                'delete': 'delete_test'
            },
            name='{basename}-detail',
            detail=True,
            initkwargs={'suffix': 'Instance'}
        ),

        routers.DynamicRoute(
            url=r'^{prefix}/{lookup}/{url_path}{trailing_slash}$',
            name='{basename}-{url_name}',
            detail=True,
            initkwargs={}
        ),
    ]


class QuestionRouter(routers.SimpleRouter):
    routes = [

        routers.Route(
            url=r'^{prefix}{trailing_slash}$',
            mapping={
                'post': 'create_question'
            },
            name='{basename}-list',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),

        routers.DynamicRoute(
            url=r'^{prefix}/{url_path}{trailing_slash}$',
            name='{basename}-{url_name}',
            detail=False,
            initkwargs={}
        ),

        routers.Route(
            url=r'^{prefix}/{lookup}{trailing_slash}$',
            mapping={
                'patch': 'update_question',
                'delete': 'delete_question'
            },
            name='{basename}-detail',
            detail=True,
            initkwargs={'suffix': 'Instance'}
        ),

        routers.DynamicRoute(
            url=r'^{prefix}/{lookup}/{url_path}{trailing_slash}$',
            name='{basename}-{url_name}',
            detail=True,
            initkwargs={}
        ),
    ]
