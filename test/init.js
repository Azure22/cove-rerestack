$.get("mice.txt", function (d)
{
    create_initial_view(initialize(d, "localhost"));
    CV.formattedData.add_format("genderCheck", create_gender_format);
    CV.nodeLayout = layout_generations(CV.formattedData.get_hierarchy());
    update_view(CV.nodeLayout);
    //var lines = find_endpoints(CV.nodeLayout, CV.genFoci);
    //setTimeout(function () { draw_arrows(CV.svg, lines, AR.line_generator); }, 5000);
});