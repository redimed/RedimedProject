//
//  CALayer+XibConfigLayer.m
//  telehealth
//
//  Created by Hung Cao Thanh on 9/18/14.
//  Copyright (c) 2014 REDiMED. All rights reserved.
//

#import "CALayer+XibConfigLayer.h"

@implementation CALayer (XibConfigLayer)

-(void)setBorderUIColor:(UIColor*)color
{
    self.borderColor = color.CGColor;
}

-(UIColor*)borderUIColor
{
    return [UIColor colorWithCGColor:self.borderColor];
}

//-(void)setBorderUIWidth:(CGFloat)borderUIWidth{
//    self.borderUIWidth = borderUIWidth;
//}
//-(CGFloat)borderUIWidth{
//    return self.borderUIWidth;
//}
@end
